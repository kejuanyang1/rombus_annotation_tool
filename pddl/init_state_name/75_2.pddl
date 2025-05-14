(define (problem scene1)
  (:domain manip)
  (:objects
    big corn - item
    yellow corn can - item
    steel knife - item
    green marker - item
    pink basket - container
    yellow basket - container
  )
  (:init
    (ontable big corn)
    (ontable yellow corn can)
    (ontable green marker)
    (ontable pink basket)
    (ontable yellow basket)
    (in steel knife yellow basket)
    (clear big corn)
    (clear yellow corn can)
    (clear green marker)
    (clear pink basket)
    (handempty)
  )
  (:goal (and ))
)