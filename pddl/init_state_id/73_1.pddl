(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_09 - item
    kitchen_21 - item
    kitchen_27 - item
    kitchen_28 - item
    container_05 - container
  )
  (:init
    (ontable kitchen_09)
    (ontable kitchen_27)
    (ontable kitchen_28)
    (in kitchen_21 container_05)
    (handempty)
    (clear kitchen_09)
    (clear kitchen_27)
    (clear kitchen_28)
  )
  (:goal (and ))
)