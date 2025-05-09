(define (problem scene1)
  (:domain manip)
  (:objects
    big corn - item
    yellow corn can - item
    steel knife - item
    pencil - item
    pink basket - container
    yellow basket - container
  )
  (:init
    (ontable big corn)
    (ontable yellow corn can)
    (ontable steel knife)
    (ontable pencil)
    (ontable pink basket)
    (ontable yellow basket)
    (clear big corn)
    (clear yellow corn can)
    (clear steel knife)
    (clear pencil)
    (clear pink basket)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)