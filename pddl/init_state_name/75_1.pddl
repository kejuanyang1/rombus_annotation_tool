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
    (ontable yellow corn can)
    (ontable steel knife)
    (in big corn pink basket)
    (in pencil yellow basket)
    (closed yellow corn can)
    (handempty)
    (clear yellow corn can)
    (clear steel knife)
  )
  (:goal (and ))
)